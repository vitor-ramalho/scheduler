import { Roles, ROLES_KEY } from './roles.decorator';
import { Reflector } from '@nestjs/core';

describe('Roles Decorator', () => {
  it('should set metadata with the provided roles', () => {
    const roles = ['admin', 'user'];
    const decorator = Roles(...roles);

    class TestClass {
      @decorator
      testMethod() {}
    }

    const reflector = new Reflector();
    const metadata = reflector.get(ROLES_KEY, TestClass.prototype.testMethod);

    expect(metadata).toEqual(roles);
  });

  it('should handle empty roles array', () => {
    const roles: string[] = [];
    const decorator = Roles(...roles);

    class TestClass {
      @decorator
      testMethod() {}
    }

    const reflector = new Reflector();
    const metadata = reflector.get(ROLES_KEY, TestClass.prototype.testMethod);

    expect(metadata).toEqual([]);
  });

  it('should handle single role', () => {
    const role = 'admin';
    const decorator = Roles(role);

    class TestClass {
      @decorator
      testMethod() {}
    }

    const reflector = new Reflector();
    const metadata = reflector.get(ROLES_KEY, TestClass.prototype.testMethod);

    expect(metadata).toEqual([role]);
  });
}); 