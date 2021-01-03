import {networkActionCreators} from '../../lib/util/redux'

export const GET_DOCUMENTATION = '[DOCUMENTATION] GET_DOCUMENTATION'
export const POST_DOCUMENTATION = '[DOCUMENTATION] POST_DOCUMENTATION'

export const getDocumentation = networkActionCreators(GET_DOCUMENTATION)
export const postDocumentation = networkActionCreators(POST_DOCUMENTATION)