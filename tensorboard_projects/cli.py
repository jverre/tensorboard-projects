import click
from tensorboard_projects.server import _run_server, handlers
from tensorboard_projects.utils import cli_args


@click.group()
@click.version_option()
def cli():
    pass


@cli.command()
@click.option(
    "--backend-store-uri",
    metavar="PATH",
    default="~/.tensorboard_projects",
    help="URI to which to persist model_metadata, defaults to ~/.tensorboard_projects",
)
@cli_args.PORT
@cli_args.HOST
def ui(port, host, backend_store_uri):

    # Initialise store
    handlers.initialize_store(backend_store_uri)
    _run_server(file_store_path=backend_store_uri, host=host, port=port, workers=1)
