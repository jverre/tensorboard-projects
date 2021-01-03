import {networkActionCreators} from '../../lib/util/redux';

export const GET_MODELS = '[MODELS] GET_MODELS';
export const ADD_EDIT_MODEL = '[MODELS] ADD_OR_EDIT_MODEL';
export const DELETE_MODEL = '[MODELS] DELETE_MODEL';

export const getModels = networkActionCreators(GET_MODELS);
export const addEditModel = networkActionCreators(ADD_EDIT_MODEL);
export const deleteModel = networkActionCreators(DELETE_MODEL);