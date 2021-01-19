import click
from tensorboard_projects.server import run_server, handlers
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
@cli_args.IP
def ui(port, ip, backend_store_uri):
    # Initialise store
    handlers.initialize_store(backend_store_uri)
    run_server(file_store_path=backend_store_uri, ip=ip, port=port, workers=1)
