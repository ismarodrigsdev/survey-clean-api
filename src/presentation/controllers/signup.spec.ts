import { SignUpController } from './signup'
describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'XXXXXXXXXXXXXXXXXX',
        password: 'XXXXXXXXXXXXXXXXXX',
        passwordConfirmation: 'XXXXXXXXXXXXXXXXXX'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  });
});