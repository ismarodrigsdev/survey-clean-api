
import { DbAddAccount } from './db-add-account'
// const makeSut = () => {
//     class EncrypterStub implements Encrypter {
//     async encrypt (value: string): Promise<string> {
//       return new Promise(resolve => resolve('hashed_password'))
//     }
//   }
//   const encrypterStub = new EncrypterStub()
//   const addAccountRepositoryStub = mXXXXXXXXXXXXXXXXXXXXXXy()
//   const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)
//   return {
//     sut,
//     encrypterStub,
//     addAccountRepositoryStub
//   }
// }

describe('DbAddAccount UseCase', () => {
  test('Shouls call encrypter with correct password', async () => {
    class EncrypterStub {
      async encrypt (value: string): Promise<string> {
        return new Promise(resolve => { resolve('hashed_password') })
      }
    }

    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub)
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

//   test('Should call AddAccountRepository with correct values', async () => {
//     const sut = makeSut()
//     const addSpy = jest.spyOn(sut.addAccountRepository, 'add')
//     const accountData = {
//       name: 'any_name',
//       email: 'XXXXXXXXXXXXXXXXXX',
//       password: 'XXXXXXXXXXXX'
//     }
//     await sut.add(accountData)
//     expect(addSpy).toHaveBeenCalledWith({
//       name: 'any_name',
//       email: 'XXXXXXXXXXXXXXXXXX',
//       password: 'XXXXXXXXXXXX'
//     })
//   })
})
