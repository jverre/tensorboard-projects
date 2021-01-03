import click

HOST = click.option(
    "--host",
    "-h",
    metavar="HOST",
    default="127.0.0.1",
    help="The network address to listen on (default: 127.0.0.1). "
    "Use 0.0.0.0 to bind to all addresses if you want to access the tracking "
    "server from other machines.",
)

PORT = click.option("--port", "-p", default=5000, help="The port to listen on (default: 5000).")

PROXY_HOST = click.option(
    "--proxy_host",
    "-proxy",
    default='',
    help="The network address to send API requests from UI to (default: HOST:PORT).")
