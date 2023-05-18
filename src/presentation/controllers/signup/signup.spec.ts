import { SignUpController } from './signup'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { EmailValidator , AccountModel, AddAccount, AddAccountModel } from '../signup/signup-protocols'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add (account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid',
        email: 'valid@mail.com',
        password: '123123123'
      }
      return fakeAccount
    }
  }
  return new AddAccountStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'XXXXXXXXXXXXXXXXXX',
        password: 'XXXXXXXXXXXXXXXXXX',
        passwordConfirmation: 'XXXXXXXXXXXXXXXXXX'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })
  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'XXXXXXXXXXXXXXXXXX',
        password: 'XXXXXXXXXXXXXXXXXX',
        passwordConfirmation: 'XXXXXXXXXXXXXXXXXX'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'XXXXXXXXXXXXXXXXXX',
        email: 'XXXXXXXXXXXXXXXXXX',
        passwordConfirmation: 'XXXXXXXXXXXXXXXXXX'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
  test('Should return 400 if no passwordConfirmation is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'XXXXXXXXXXXXXXXXXX',
        email: 'XXXXXXXXXXXXXXXXXX',
        password: 'XXXXXXXXXXXXXXXXXX'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })
  test('Should return 400 if passwordConfirmation fails', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'XXXXXXXXXXXXXXXXXX',
        email: 'XXXXXXXXX@mail.com',
        password: 'XXXXXXXXXXXXXXXXXX',
        passwordConfirmation: 'invalid_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })
  test('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'XXXXXXXXXXXXXXXXXX',
        email: 'invalid_email@mail.com',
        password: 'XXXXXXXXXXXXXXXXXX',
        passwordConfirmation: 'XXXXXXXXXXXXXXXXXX'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'XXXXXXXXXXXXXXXXXX',
        email: 'email@mail.com',
        password: 'XXXXXXXXXXXXXXXXXX',
        passwordConfirmation: 'XXXXXXXXXXXXXXXXXX'
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('email@mail.com')
  })
  test('Should return 500 if emai validator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'XXXXXXXXXXXXXXXXXX',
        email: 'invalid_email@mail.com',
        password: 'XXXXXXXXXXXXXXXXXX',
        passwordConfirmation: 'XXXXXXXXXXXXXXXXXX'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('Should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'XXXXXXXXXXXXXXXXXX',
        email: 'email@mail.com',
        password: 'XXXXXXXXXXXXXXXXXX',
        passwordConfirmation: 'XXXXXXXXXXXXXXXXXX'
      }
    }
    sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(
      {
        name: 'XXXXXXXXXXXXXXXXXX',
        email: 'email@mail.com',
        password: 'XXXXXXXXXXXXXXXXXX'
      }
    )
  })
  test('Should return 500 if AddAccount throws', () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'XXXXXXXXXXXXXXXXXX',
        email: 'email@mail.com',
        password: 'XXXXXXXXXXXXXXXXXX',
        passwordConfirmation: 'XXXXXXXXXXXXXXXXXX'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('Should return 200 if valid data is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'valid',
        email: 'valid@mail.com',
        password: '123123123',
        passwordConfirmation: '123123123'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid',
      email: 'valid@mail.com',
      password: '123123123'
    })
  })
})
