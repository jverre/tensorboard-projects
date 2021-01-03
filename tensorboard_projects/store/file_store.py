import os
import json
import glob
import shutil
from tensorboard_projects.types.initialization import create_model_metadata

from tensorboard.backend.event_processing import directory_loader
from tensorboard.backend.event_processing import event_file_loader
from tensorboard.backend.event_processing import io_wrapper
from tensorboard.uploader import logdir_loader


class FileStore():
    def __init__(self, root_directory):
        if root_directory is None:
            raise ValueError('root_directory cannot be None')
        self.root_directory = os.path.expanduser(root_directory)

    def get_models(self):
        models_path = os.path.join(self.root_directory, 'models', '*')

        models = []
        for model_path in glob.glob(models_path):
            model_id = os.path.split(model_path)[-1]
            models += [self.get_model_metadata(model_id)]
        return models

    def create_or_update_model(self, model_id, model_metadata):
        model_metadata_path = os.path.join(self.root_directory, 'models/{model_id}/metadata.json'.format(model_id=model_id))
        model_metadata['model_id'] = model_id
        model_metadata = create_model_metadata(model_metadata)
        if not os.path.exists(os.path.dirname(model_metadata_path)):
            os.makedirs(os.path.dirname(model_metadata_path))

        if os.path.exists(model_metadata_path):
            # Update model
            with open(model_metadata_path, 'w') as d:
                json.dump(model_metadata, d)
        else:
            # Create model
            with open(model_metadata_path, 'w') as f:
                json.dump(model_metadata, f)

            model_summary_path = os.path.join(self.root_directory,
                                              'models/{model_id}/documentation_summary.json'.format(model_id=model_id))
            model_panes_path = os.path.join(self.root_directory,
                                            'models/{model_id}/documentation_panes.json'.format(model_id=model_id))
            custom_runs_path = os.path.join(self.root_directory,
                                            'models/{model_id}/custom_runs.json'.format(model_id=model_id))
            with open(model_summary_path, 'w') as f:
                json.dump("", f)
            with open(model_panes_path, 'w') as f:
                json.dump([], f)
            with open(custom_runs_path, 'w') as f:
                json.dump([], f)

        return model_metadata

    def delete_model(self, model_id):
        model_path = os.path.join(self.root_directory, 'models/{model_id}'.format(model_id=model_id))
        shutil.rmtree(model_path)

    def _get_runs_tensorboard(self, path, model_name=None, model_version=None):
        def directory_loader_factory(path):
            return directory_loader.DirectoryLoader(
                path,
                event_file_loader.TimestampedEventFileLoader,
                path_filter=io_wrapper.IsTensorFlowEventsFile,
            )

        _logdir_loader = logdir_loader.LogdirLoader(
            path, directory_loader_factory
        )

        _logdir_loader.synchronize_runs()

        run_ids = _logdir_loader.get_run_events().keys()
        runs = [{
            'run_id': run_id,
            'model_name': model_name,
            'model_version': model_version,
            'path': os.path.join(path, run_id)} for run_id in run_ids]

        for run in runs:
            created_timestamps = []
            for root, dirs, files in os.walk(run['path']):
                for file in files:
                    if file.startswith("events.out.tfevents"):
                        created_timestamps += [file.split('.')[3]]

            run['created_at'] = int(min(created_timestamps)) * 1000

        return runs

    def get_model_runs(self, model_id):
        model_metadata = self.get_model_metadata(model_id)

        # Model path - Split by comma and replace {model_version}
        model_path = model_metadata['path']
        model_name = model_metadata['model_name']

        model_runs = []
        for path in model_path.split(","):
            if '{model_version}' in path:
                root_path = path.split('{model_version}')[0]

                if os.path.exists(root_path):
                    for model_version in os.listdir(root_path):
                        version_path = path.format(model_version=model_version)
                        model_runs += self._get_runs_tensorboard(version_path,
                                                                 model_name=model_name,
                                                                 model_version=model_version)
            else:
                root_path = path
                if os.path.exists(path):
                    model_runs += self._get_runs_tensorboard(path,
                                                             model_name=model_name,
                                                             model_version='')

        # Get runs
        custom_runs_path = os.path.join(self.root_directory,
                                        'models/{model_id}/custom_runs.json'.format(model_id=model_id))
        with open(custom_runs_path, 'r') as f:
            custom_runs_list = json.load(f)
        custom_runs = {x['path']: x for x in custom_runs_list}

        updated_model_runs = []
        for run in model_runs:
            if run['path'] in custom_runs:
                run = custom_runs[run['path']]

            if run['path'] in model_metadata['archived_runs']:
                run['archived'] = True
            else:
                run['archived'] = False

            updated_model_runs += [run]

        return updated_model_runs

    def archive_runs(self, model_id, runs):
        model_metadata = self.get_model_metadata(model_id)

        model_metadata['archived_runs'] = list(set(model_metadata['archived_runs'] + [x['path'] for x in runs]))
        new_model_metadata = self.create_or_update_model(model_id, model_metadata)
        return new_model_metadata['archived_runs']

    def unarchive_runs(self, model_id, runs):
        model_metadata = self.get_model_metadata(model_id)

        model_metadata['archived_runs'] = [x for x in model_metadata['archived_runs'] if x not in [y['path'] for y in runs]]
        new_model_metadata = self.create_or_update_model(model_id, model_metadata)
        return new_model_metadata['archived_runs']

    def delete_runs(self, model_id, runs):
        deleted_runs = []

        for run in runs:
            run_path = run['path']
            shutil.rmtree(run_path)
            deleted_runs += [run_path]

        return deleted_runs

    def edit_runs(self, model_id, runs):
        # Create custom runs
        custom_runs_path = os.path.join(self.root_directory, 'models/{model_id}/custom_runs.json'.format(model_id=model_id))

        if os.path.exists(custom_runs_path):
            with open(custom_runs_path, 'r') as f:
                custom_runs = json.load(f)
        else:
            custom_runs = []

        # Remove edited runs pah if they already have been edited
        edited_runs_path = [x['path'] for x in runs]
        custom_runs = [x for x in custom_runs if x['path'] not in edited_runs_path]

        # Add new edited
        custom_runs += runs
        with open(custom_runs_path, 'w') as f:
            json.dump(custom_runs, f)

        return runs

    def get_model_metadata(self, model_id):
        model_metadata_path = os.path.join(self.root_directory,
                                           'models/{model_id}/metadata.json'.format(model_id=model_id))
        with open(model_metadata_path, 'r') as f:
            model_metadata = json.load(f)

        return model_metadata

    def get_model_documentation(self, model_id):
        documentation_summary_path = os.path.join(self.root_directory,
                                                  'models/{model_id}/documentation_summary.json'.format(model_id=model_id))
        documentation_panes_path = os.path.join(self.root_directory,
                                                'models/{model_id}/documentation_panes.json'.format(model_id=model_id))
        documentation_metadata = os.path.join(self.root_directory,
                                              'models/{model_id}/metadata.json'.format(model_id=model_id))
        with open(documentation_summary_path, 'r') as f:
            documentation_summary = json.load(f)
        with open(documentation_panes_path, 'r') as f:
            documentation_panes = json.load(f)
        with open(documentation_metadata, 'r') as f:
            documentation_metadata = json.load(f)

        model_documentation = {
                'documentation_summary': documentation_summary,
                'documentation_panes': documentation_panes,
                'documentation_metadata': documentation_metadata
        }

        return model_documentation

    def update_documentation(self, model_id, documentation):
        documentation_summary = documentation['documentation_summary']
        documentation_panes = documentation['documentation_panes']

        documentation_summary_path = os.path.join(self.root_directory,
                                                  'models/{model_id}/documentation_summary.json'.format(model_id=model_id))
        documentation_panes_path = os.path.join(self.root_directory,
                                                'models/{model_id}/documentation_panes.json'.format(model_id=model_id))

        with open(documentation_summary_path, 'w') as f:
            json.dump(documentation_summary, f)
        with open(documentation_panes_path, 'w') as f:
            json.dump(documentation_panes, f)
        return documentation
