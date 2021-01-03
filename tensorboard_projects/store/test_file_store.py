import unittest
import os
import uuid
import random
import tempfile
import logging
import sys
import shutil
from tensorboard_projects.store.file_store import FileStore

import tensorflow as tf


logging.basicConfig(stream=sys.stderr)
logger = logging.getLogger("FileStoreTest")
logger.setLevel(logging.DEBUG)


class TestFileStore(unittest.TestCase):
    ROOT_LOCATION = tempfile.gettempdir()
    NB_VERSIONS = 3
    NB_RUNS = 10

    def setUp(self):
        try:
            self._create_root(TestFileStore.ROOT_LOCATION)
        except Exception as e:
            self.tearDown()
            raise e

    def tearDown(self):
        self._delete_root(TestFileStore.ROOT_LOCATION)

    def _create_root(self, root):
        # Create file store
        self.test_root = os.path.join(root, "test_file_store_{}".format(random.randint(0, 1000)))
        os.mkdir(self.test_root)

        # Create model versions
        for version_nb in range(TestFileStore.NB_VERSIONS):
            run_version = 'v{}.0.0'.format(version_nb)
            model_version_path = os.path.join(root, "runs/{run_version}".format(run_version=run_version))
            logging.info(model_version_path)
            os.makedirs(model_version_path)

            # Create model runs
            for _ in range(TestFileStore.NB_RUNS):
                run_id = str(uuid.uuid4())
                run_path = os.path.join(model_version_path, 'logs', run_id)
                os.makedirs(run_path)

                with tf.summary.create_file_writer(run_path).as_default():
                    for i in range(0, 100):
                        tf.summary.scalar("metric_1", random.random(), step=i)
                        tf.summary.scalar("metric_2", random.random(), step=i)

    def _delete_root(self, root):
        shutil.rmtree(root, ignore_errors=True)

    def get_store(self):
        return FileStore(self.test_root)

    def testModelWithVersion(self):
        fileStore = self.get_store()

        # Create new model
        model_id = 'model_1'
        model_metadata = {
            'model_id': model_id,
            'model_name': 'Model 1',
            'path': os.path.join(TestFileStore.ROOT_LOCATION, 'runs/{model_version}/logs'),
            'description': 'Model description string'
        }
        fileStore.create_or_update_model(model_id, model_metadata)
        models = fileStore.get_models()
        self.assertEqual(len(models), 1, msg="Model was not created correctly")

        # Get model runs
        runs = fileStore.get_model_runs(model_id)
        self.assertEqual(len(runs), TestFileStore.NB_VERSIONS * TestFileStore.NB_RUNS, msg="Runs were not detected correctly")

        # Delete model
        fileStore.delete_model(model_id)
        models = fileStore.get_models()
        self.assertEqual(len(models), 0, msg="Model was not deleted correctly")

    def testModelWithoutVersion(self):
        fileStore = self.get_store()

        # Create new model
        model_id = 'model_1_v1.0.0'
        model_metadata = {
            'model_id': model_id,
            'model_name': 'Model 1 - Version 1',
            'path': os.path.join(TestFileStore.ROOT_LOCATION, 'runs/v1.0.0/logs'),
            'description': 'Model description string'
        }
        fileStore.create_or_update_model(model_id, model_metadata)
        models = fileStore.get_models()
        self.assertEqual(len(models), 1, msg="Model was not created correctly")

        # Get model runs
        runs = fileStore.get_model_runs(model_id)
        self.assertEqual(len(runs), TestFileStore.NB_RUNS, msg="Runs were not detected correctly")

        # Delete model
        fileStore.delete_model(model_id)
        models = fileStore.get_models()
        self.assertEqual(len(models), 0, msg="Model was not deleted correctly")

    def testRunsArchive(self):
        fileStore = self.get_store()

        # Create new model
        model_id = 'model_1_archive'
        model_metadata = {
            'model_id': model_id,
            'model_name': 'Model 1',
            'path': os.path.join(TestFileStore.ROOT_LOCATION, 'runs/{model_version}/logs'),
            'description': 'Model description string'
        }
        fileStore.create_or_update_model(model_id, model_metadata)

        # Archive runs
        runs = fileStore.get_model_runs(model_id)
        runs_to_archive = runs[0:3]
        fileStore.archive_runs(model_id, runs_to_archive)

        updated_runs = fileStore.get_model_runs(model_id)
        for run in updated_runs:
            if run['path'] in [x['path'] for x in runs_to_archive]:
                self.assertEqual(run['archived'], True, msg='Run was not archived')
            else:
                self.assertEqual(run['archived'], False, msg='Run was incorrectly archived')

        # Unarchive runs
        runs = fileStore.get_model_runs(model_id)
        runs_to_unarchive = [x for x in runs if x['archived']]
        fileStore.unarchive_runs(model_id, runs_to_unarchive)

        updated_runs = fileStore.get_model_runs(model_id)
        for run in updated_runs:
            self.assertEqual(run['archived'], False, msg='Run was not unarchived')

    def testDocumentationUpdate(self):
        fileStore = self.get_store()

        # Create new model
        model_id = 'model_1_documentation'
        model_metadata = {
            'model_id': model_id,
            'model_name': 'Model 1',
            'path': os.path.join(TestFileStore.ROOT_LOCATION, 'runs/{model_version}/logs'),
            'description': 'Model description string'
        }
        fileStore.create_or_update_model(model_id, model_metadata)

        # Get model documentation
        documentation = fileStore.get_model_documentation(model_id)

        self.assertEqual(documentation['documentation_summary'], '', msg='Documentation summary was not correctly initialized')
        self.assertEqual(documentation['documentation_panes'], [], msg='Documentation panes was not correctly initialized')

        # Update documentation
        new_documentation_summary = {
            'documentation_summary': 'This is the new model summary',
            'documentation_panes': [{'title': 'This is a new tab', 'content': 'This is the new content', 'key': 1}]
        }
        fileStore.update_documentation(model_id, new_documentation_summary)

        documentation = fileStore.get_model_documentation(model_id)
        self.assertEqual(documentation['documentation_summary'], new_documentation_summary['documentation_summary'],
                         msg='Documentation summary was not correctly updated')
        self.assertEqual(documentation['documentation_panes'], new_documentation_summary['documentation_panes'],
                         msg='Documentation panes was not correctly updated')

    def testEditRuns(self):
        fileStore = self.get_store()

        # Create new model
        model_id = 'model_1_edit_runs'
        model_metadata = {
            'model_id': model_id,
            'model_name': 'Model 1',
            'path': os.path.join(TestFileStore.ROOT_LOCATION, 'runs/{model_version}/logs'),
            'description': 'Model description string'
        }
        fileStore.create_or_update_model(model_id, model_metadata)

        # Edit runs
        runs = fileStore.get_model_runs(model_id)
        edited_runs = runs[0:1]
        for run in edited_runs:
            run['new_field_int'] = 1
            run['new_field_str'] = 'string'
        fileStore.edit_runs(model_id, edited_runs)

        # Check new runs
        updated_runs = fileStore.get_model_runs(model_id)
        self.assertEqual(len(updated_runs), len(runs), msg='Not the same number of runs after edits')
        for run in updated_runs:
            if run['path'] in [x['path'] for x in edited_runs]:
                expected_run = [x for x in edited_runs if x['path'] == run['path']][0]
                self.assertDictEqual(run, expected_run, msg='Runs not edited correctly')
            else:
                expected_run = [x for x in runs if x['path'] == run['path']][0]
                self.assertDictEqual(run, expected_run, msg='Runs edited incorrectly')
