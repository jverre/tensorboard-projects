import os
import shlex
import textwrap
import logging

from flask import Flask, request, send_from_directory, Response, make_response, jsonify
from flask_cors import CORS

from tensorboard_projects.utils.process import exec_cmd
import tensorboard_projects.server.handlers as handlers

logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

REL_STATIC_DIR = "js/build"

app = Flask(__name__, static_folder=REL_STATIC_DIR)
CORS(app)
STATIC_DIR = os.path.join(app.root_path, REL_STATIC_DIR)

STATIC_PREFIX_ENV_VAR = "_TENSORBOARD_PROJECTS_STATIC_PREFIX"
BACKEND_STORE_URI_ENV_VAR = "_TENSORBOARD_PROJECTS_SERVER_FILE_STORE"
PROXY_URI_ENV_VAR = "REACT_APP_TENSORBOARD_PROJECTS_PROXY"


def _add_static_prefix(route):
    prefix = os.environ.get(STATIC_PREFIX_ENV_VAR)
    if prefix:
        return prefix + route
    return route


@app.route(_add_static_prefix("/api/models"))
def get_models():
    logger.info('API call: GET /api/models - Get models')
    models = handlers.get_models()
    response = make_response(jsonify(models))

    return response


@app.route(_add_static_prefix("/api/model/<model_id>"), methods=['POST'])
def update_model(model_id):
    logger.info('API call: POST /api/models/<model_id> - Create or Update model')
    model_metadata = request.get_json()

    model_metadata = handlers.create_or_update_model(model_id, model_metadata)
    response = make_response(jsonify(model_metadata))

    return response


@app.route(_add_static_prefix("/api/model/<model_id>"), methods=['DELETE'])
def delete_model(model_id):
    logger.info('API call: DELETE /api/models/<model_id> - Delete model')
    handlers.delete_model(model_id)
    response = make_response(jsonify({'model_id': model_id}))

    return response


@app.route(_add_static_prefix("/api/model/<model_id>/runs"), methods=['GET'])
def get_runs(model_id):
    logger.info('API call: GET /api/model/<model_id>/runs - Get model runs')
    model_runs = handlers.get_model_runs(model_id)
    response = make_response(jsonify(model_runs))

    return response


@app.route(_add_static_prefix("/api/model/<model_id>/runs"), methods=['POST'])
def edit_runs(model_id):
    logger.info('API call: POST /api/model/<model_id>/runs - Update model runs')
    payload = request.get_json()

    if payload['action'] == 'archive':
        archived_runs = handlers.archive_runs(model_id, payload['runs'])
        response = make_response({'archived_runs': archived_runs})
        return response
    elif payload['action'] == 'unarchive':
        archived_runs = handlers.unarchive_runs(model_id, payload['runs'])
        response = make_response({'archived_runs': archived_runs})
        return response
    elif payload['action'] == 'delete':
        archived_runs = handlers.delete_runs(model_id, payload['runs'])
        response = make_response({'deleted_runs': archived_runs})
        return response
    elif payload['action'] == 'edit':
        edited_runs = handlers.edit_runs(model_id, payload['runs'])
        response = make_response({'edited_runs': edited_runs})
        return response
    else:
        response = make_response({'error': 'action not supported'})
        return response


@app.route(_add_static_prefix("/api/model/<model_id>/documentation"), methods=['GET'])
def get_documentation(model_id):
    logger.info('API call: GET /api/model/<model_id>/documentatin - GET model documentation')
    documentation = handlers.get_documentation(model_id)
    return make_response(jsonify(documentation))


@app.route(_add_static_prefix("/api/model/<model_id>/documentation"), methods=['POST'])
def update_documentation(model_id):
    logger.info('API call: POST /api/model/<model_id>/documentation - Update model documentation')
    documentation = request.get_json()
    handlers.update_documentation(model_id=model_id,
                                  documentation=documentation)
    return make_response(jsonify(documentation))


@app.route(_add_static_prefix("/api/dashboards"), methods=['GET'])
def get_dashboards():
    logger.info('API call: GET /api/dashboards - Update active dashboards')
    active_dashboards = handlers.get_dashboards()
    response = make_response(jsonify(active_dashboards))
    return response


@app.route(_add_static_prefix("/api/dashboards"), methods=['POST'])
def start_dashboards():
    logger.info('API call: POST /api/dashboards - Start dashboard')
    payload = request.get_json()
    runs = payload['runs']
    model_id = payload['model_id']

    dashboard_data = handlers.start_tensorboard_dashboard(model_id=model_id, runs=runs)

    response = make_response(jsonify(dashboard_data))
    return response


@app.route(_add_static_prefix("/api/dashboards"), methods=['DELETE'])
def stop_dashboards():
    logger.info('API call: DELETE /api/dashboards - Stop dashboard')
    dashboard_id = request.args.get('dashboardId')
    dashboard_data = handlers.stop_tensorboard_dashboard(dashboard_id=dashboard_id)

    response = make_response(jsonify(dashboard_data))
    return response


@app.route(_add_static_prefix("/static-files/<path:path>"))
def serve_static_file(path):
    page = send_from_directory(STATIC_DIR, path)
    return page


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if os.path.exists(os.path.join(STATIC_DIR, "index.html")):
        page = send_from_directory(STATIC_DIR, "index.html")
        return page

    text = textwrap.dedent(
        """
    Unable to display Tensorboard Projects UI - landing page (index.html) not found.
    """
    )
    return Response(text, mimetype="text/plain")


def _build_gunicorn_command(gunicorn_opts, host, port, workers):
    bind_address = "%s:%s" % (host, port)
    opts = shlex.split(gunicorn_opts) if gunicorn_opts else []
    return ["gunicorn"] + opts + ["-b", bind_address, "-w", "%s" % workers, "tensorboard_projects.server:app"]


def _run_server(
    file_store_path,
    host,
    port,
    proxy_host=None,
    workers=None,
    gunicorn_opts=None,
):
    """
    Run the Stakion server, wrapping it in gunicorn
    :return: None
    """
    env_map = {}
    if file_store_path:
        env_map[BACKEND_STORE_URI_ENV_VAR] = file_store_path

    if proxy_host:
        env_map[PROXY_URI_ENV_VAR] = proxy_host

    # ToDo: Fix this
    # In order for the proxy host to be used, we create a new env.js file in the STATIC_DIR folder
    with open(os.path.join(STATIC_DIR, 'env.js'), 'w') as f:
        f.write("window.API_URL = '{}';".format(proxy_host))

    full_command = _build_gunicorn_command(gunicorn_opts, host, port, workers or 4)
    exec_cmd(full_command, env=env_map, stream_output=True)
