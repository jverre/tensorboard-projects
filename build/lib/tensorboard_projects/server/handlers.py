import os
from tensorboard_projects.dashboard.tensorboard import stop_dashboard
from tensorboard_projects.dashboard.tensorboard import TensorBoardDashboard
from tensorboard_projects.store.file_store import FileStore

_store = None
_active_dashboards = {}


def _get_store(backend_store_uri=None):
    from tensorboard_projects.server import BACKEND_STORE_URI_ENV_VAR
    global _store

    if _store is None:
        store_ui = backend_store_uri or os.environ.get(BACKEND_STORE_URI_ENV_VAR, None)
        _store = FileStore(root_directory=store_ui)

    return _store


def initialize_store(backend_store_uri):
    # Initialise store
    _get_store(backend_store_uri)


def get_models():
    store = _get_store()
    return store.get_models()


def get_model_runs(model_id):
    store = _get_store()
    return store.get_model_runs(model_id)


def archive_runs(model_id, runs):
    store = _get_store()
    return store.archive_runs(model_id, runs)


def unarchive_runs(model_id, runs):
    store = _get_store()
    return store.unarchive_runs(model_id, runs)


def delete_runs(model_id, runs):
    store = _get_store()
    return store.delete_runs(model_id, runs)


def edit_runs(model_id, runs):
    store = _get_store()
    return store.edit_runs(model_id, runs)


def create_or_update_model(model_id, model_metadata):
    store = _get_store()
    return store.create_or_update_model(model_id, model_metadata)


def delete_model(model_id):
    store = _get_store()
    return store.delete_model(model_id)


def get_documentation(model_id):
    store = _get_store()

    return store.get_model_documentation(model_id)


def update_documentation(model_id, documentation):
    store = _get_store()

    return store.update_documentation(model_id, documentation)


def start_tensorboard_dashboard(model_id, runs):
    from tensorboard_projects.server import BACKEND_STORE_URI_ENV_VAR

    dashboard = TensorBoardDashboard(
        root_directory=os.environ.get(BACKEND_STORE_URI_ENV_VAR, None),
        runs=runs)

    dashboard_metadata = dashboard.start(model_id)

    global _active_dashboards
    _active_dashboards[dashboard_metadata['dashboard_id']] = dashboard_metadata

    return {'dashboards': get_dashboards(), 'dashboard_id': dashboard_metadata['dashboard_id']}


def stop_tensorboard_dashboard(dashboard_id):
    global _active_dashboards

    dashboard_metadata = _active_dashboards.get(dashboard_id, None)
    stop_dashboard(dashboard_metadata)

    _active_dashboards.pop(dashboard_id, None)

    return {'dashboards': get_dashboards(), 'dashboard_id': dashboard_metadata['dashboard_id']}


def get_dashboards():
    global _active_dashboards

    return list(_active_dashboards.values())
