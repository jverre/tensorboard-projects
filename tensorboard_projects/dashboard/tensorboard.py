import os
from tensorboard_projects import server
import uuid
import time
import signal

from tensorboard.compat.tensorflow_stub.io import gfile
from tensorboard import manager


class TensorBoardDashboard():
    def __init__(self, root_directory, runs):
        super().__init__()
        if root_directory is None:
            raise ValueError('root_directory cannot be None')
        self.root_directory = os.path.expanduser(root_directory)

        self.runs = runs
        self.port = None
        self.dashboard_ID = str(uuid.uuid4())
        self.dest_path = os.path.join(self.root_directory, 'dashboards', self.dashboard_ID)

    def _create_symlink_dir(self):
        if gfile.exists(self.dest_path):
            raise ValueError("Dashboard already exists - Couldn't create directory")
        else:
            for run in self.runs:
                run_path = run['path']
                run_name = run['name']

                if not gfile.exists(os.path.dirname(os.path.join(self.dest_path, run_name))):
                    gfile.makedirs(os.path.dirname(os.path.join(self.dest_path, run_name)))

                os.symlink(run_path, os.path.join(self.dest_path, run_name), target_is_directory=True)

    def start(self, model_id):
        self._create_symlink_dir()
        proxy_host = os.environ[server.PROXY_URI_ENV_VAR]

        parsed_args = ["--logdir", self.dest_path,
                       "--reload_multifile", "true",
                       "--bind_all"]
        start_result = manager.start(parsed_args)
        
        dashboard_host = proxy_host.split(':')[0]
        path = '{dashboard_host}:{port}'.format(dashboard_host=dashboard_host, port=start_result.info.port)
        return {
            'model_id': model_id,
            'path': path,
            'port': start_result.info.port,
            'dashboard_id': self.dashboard_ID,
            'created_at': time.time(),
            'pid': start_result.info.pid}


def stop_dashboard(dashboard_metadata):
    if dashboard_metadata is not None:
        dashboard_pid = dashboard_metadata['pid']
        os.kill(dashboard_pid, signal.SIGTERM)
