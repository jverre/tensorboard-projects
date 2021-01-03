from typing import List
from typing_extensions import TypedDict


class DocumentationPane(TypedDict):
    key: str
    title: str
    content: str


class ModelDocumentation(TypedDict):
    documentation_summary: str
    documentation_panes: List[DocumentationPane]


class ModelMetadata(TypedDict):
    model_id: str
    model_name: str
    description: str
    path: str
    archived_runs: List[str]


class DashboardMetadata(TypedDict):
    dashboard_id: str
    created_at: int
    path: str
    port: str
