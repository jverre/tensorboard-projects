export const getModelName = (models, modelId) => {
    const model = models.filter(x => x.model_id === modelId)[0];
    
    if (model === undefined) {
        return modelId;
    } else {
        return model.model_name || modelId;
    }

}