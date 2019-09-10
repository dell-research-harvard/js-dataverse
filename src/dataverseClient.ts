import axios, { AxiosResponse } from 'axios'
import { DataverseSearchOptions, SearchOptions } from './@types/searchOptions'
import { DataverseHeaders } from './@types/dataverseHeaders'
import { DataverseException } from './exceptions/dataverseException'

export class DataverseClient {
  private readonly host: string
  private readonly apiToken: string

  public constructor(host: string, apiToken?: string) {
    this.host = host
    this.apiToken = apiToken
  }

  public async getDataverseInformation(dataverseAlias: string): Promise<AxiosResponse> {
    const url = `${this.host}/api/dataverses/${dataverseAlias}`
    return await axios.get(url, { headers: this.getHeaders() }).catch(error => {
      throw new DataverseException(error.response.status, error.response.data.message)
    })
  }

  public async listDatasets(dataverseAlias: string): Promise<AxiosResponse> {
    const url = `${this.host}/api/dataverses/${dataverseAlias}/contents`
    return await axios.get(url, { headers: this.getHeaders() }).catch(error => {
      throw new DataverseException(error.response.status, error.response.data.message)
    })
  }

  public async search(options: SearchOptions): Promise<AxiosResponse> {
    const url = `${this.host}/api/search`
    const requestOptions: DataverseSearchOptions = this.mapSearchOptions(options)
    return await axios.get(url, { params: requestOptions }).catch(error => {
      throw new DataverseException(error.response.status, error.response.data.message)
    })
  }

  public async getFile(fileId: string): Promise<AxiosResponse> {
    const url = `${this.host}/api/access/datafile/${fileId}`
    return await axios.get(url, { headers: this.getHeaders() }).catch(error => {
      throw new DataverseException(error.response.status, error.response.data.message)
    })
  }

  public async getFileMetadata(fileId: string, draftVersion = false): Promise<AxiosResponse> {
    const url = `${this.host}/api/files/${fileId}/metadata/${draftVersion ? 'draft' : ''}`
    return await axios.get(url, { headers: this.getHeaders() }).catch(error => {
      throw new DataverseException(error.response.status, error.response.data.message)
    })
  }

  public async getDatasetInformation(datasetId: string, datasetVersion: string): Promise<AxiosResponse> {
    const url = `${this.host}/api/datasets/${datasetId}/versions/${datasetVersion}`
    return await axios.get(url, { headers: this.getHeaders() }).catch(error => {
      throw new DataverseException(error.response.status, error.response.data.message)
    })
  }

  public async listDataverseRoleAssignments(dataverseAlias: string): Promise<AxiosResponse> {
    const url = `${this.host}/api/dataverses/${dataverseAlias}/assignments`
    return await axios.get(url, { headers: this.getHeaders() }).catch(error => {
      throw new DataverseException(error.response.status, error.response.data.message)
    })
  }

  private getHeaders(): DataverseHeaders {
    return {
      'X-Dataverse-key': this.apiToken ? this.apiToken : ''
    }
  }

  private mapSearchOptions(options: SearchOptions): DataverseSearchOptions {
    return {
      q: options.query,
      subtree: options.dataverseAlias,
      start: options.startPosition,
      type: options.type,
      sort: options.sortAttribute,
      order: options.order,
      'per_page': options.itemsPerPage,
      'show_entity_ids': options.showEntityIds,
      'show_relevance': options.showRelevance
    }
  }
}