import type { KVNamespace } from '@cloudflare/workers-types'
// @ts-ignore
import manifestJSON from '__STATIC_CONTENT_MANIFEST';

export type KVAssetOptions = {
    manifest?: object | string
    namespace?: KVNamespace
}



export const getContentFromKVAsset = async (
    env: any,
    path: string,
    options?: KVAssetOptions
  ): Promise<ArrayBuffer | null> => {
    let ASSET_MANIFEST: Record<string, string> = {}
  
    if (options && options.manifest) {
      if (typeof options.manifest === 'string') {
        ASSET_MANIFEST = JSON.parse(options.manifest)
      } else {
        ASSET_MANIFEST = options.manifest as Record<string, string>
      }
    } else {
      if (typeof manifestJSON === 'string') {
        ASSET_MANIFEST = JSON.parse(manifestJSON)
      } else {
        ASSET_MANIFEST = manifestJSON
      }
    }
  
    let ASSET_NAMESPACE: KVNamespace
    if (options && options.namespace) {
      ASSET_NAMESPACE = options.namespace
    } else {
      ASSET_NAMESPACE = env.__STATIC_CONTENT as KVNamespace
    }
  
    console.log(ASSET_MANIFEST)
    const key = ASSET_MANIFEST[path] || path
    if (!key) {
      return null
    }
  
    const content = await ASSET_NAMESPACE.get(key, { type: 'arrayBuffer' })
    if (!content) {
      return null
    }
    return content as unknown as ArrayBuffer
  }