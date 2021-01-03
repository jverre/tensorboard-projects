import {post, get, delete_req} from './../util/request'

async function get_(path, params) {
    const response = get(path, params)
    return response
}

async function delete_(path, params) {
    console.log('delete')
    const response = delete_req(path, params)
    return response
}

async function post_(path, payload) {
    const response = post(path, {data: payload, json: true})
    return response
}

export function createApi(api) {
    api.get = (path, params) => get_(path, params)
    api.post = (path, payload) => post_(path, payload)
    api.delete = (path, params) => delete_(path, params)
    return api
}