def create_model_metadata(model_metadata):
    return {
        'model_id': model_metadata.get('model_id', ''),
        'model_name': model_metadata.get('model_name', ''),
        'description': model_metadata.get('description', ''),
        'path': model_metadata.get('path', ''),
        'archived_runs': model_metadata.get('archived_runs', []),
        'deleted_runs': model_metadata.get('deleted_runs', []),
    }
