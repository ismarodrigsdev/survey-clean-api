import { AddAccount, AddAccountModel, AccountModel, Encrypter, AddAccountRepository } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly AddAccountRepository: AddAccountRepository

  constructor (encrypter: Encrypter, AddAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.AddAccountRepository = AddAccountRepository
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(account.password)
    const accountModel = await this.AddAccountRepository.add({ ...account, password: hashedPassword })
    return accountModel
  }
}
