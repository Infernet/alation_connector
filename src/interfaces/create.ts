export interface ICreateData {

}

export interface ICreateKey {

}

export interface ICreateRecord<K extends ICreateKey, D extends ICreateData> {
  key: K,
  data: D
}
