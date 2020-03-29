// eslint-env jest
import { fromJS } from 'immutable';

import { denormalizeSimple as denormalize } from '../../denormalize';
import { normalize, schema } from '../../';

describe(`${schema.Object.name} normalization`, () => {
  test('normalizes an object', () => {
    const userSchema = new schema.Entity('user');
    const object = new schema.Object({
      user: userSchema,
    });
    expect(normalize({ user: { id: 1 } }, object)).toMatchSnapshot();
  });

  test(`normalizes plain objects as shorthand for ${schema.Object.name}`, () => {
    const userSchema = new schema.Entity('user');
    expect(
      normalize({ user: { id: 1 } }, { user: userSchema }),
    ).toMatchSnapshot();
  });

  test('filters out undefined and null values', () => {
    const userSchema = new schema.Entity('user');
    const users = { foo: userSchema, bar: userSchema, baz: userSchema };
    expect(normalize({ foo: {}, bar: { id: '1' } }, users)).toMatchSnapshot();
  });
});

describe(`${schema.Object.name} denormalization`, () => {
  test('denormalizes an object', () => {
    const userSchema = new schema.Entity('user');
    const object = new schema.Object({
      user: userSchema,
    });
    const entities = {
      user: {
        1: { id: 1, name: 'Nacho' },
      },
    };
    expect(denormalize({ user: 1 }, object, entities)).toMatchSnapshot();
    expect(
      denormalize({ user: 1 }, object, fromJS(entities)),
    ).toMatchSnapshot();
    expect(
      denormalize(fromJS({ user: 1 }), object, fromJS(entities)),
    ).toMatchSnapshot();
  });

  test('denormalizes an object with plain members', () => {
    const userSchema = new schema.Entity('user');
    const object = new schema.Object({
      user: userSchema,
      plain: '',
    });
    const entities = {
      user: {
        1: { id: 1, name: 'Nacho' },
      },
    };
    expect(denormalize({ user: 1 }, object, entities)).toMatchSnapshot();
    expect(
      denormalize({ user: 1 }, object, fromJS(entities)),
    ).toMatchSnapshot();
    expect(
      denormalize(fromJS({ user: 1 }), object, fromJS(entities)),
    ).toMatchSnapshot();
  });

  test('should have found = true with null member even when schema has nested entity', () => {
    const userSchema = new schema.Entity('user');
    const object = {
      item: new schema.Object({
        user: userSchema,
      }),
    };
    const entities = {
      user: {
        1: { id: 1, name: 'Nacho' },
      },
    };
    let [value, found] = denormalize({ item: null }, object, entities);
    expect(value).toMatchSnapshot();
    expect(found).toBe(true);
    [value, found] = denormalize({ item: null }, object, fromJS(entities));
    expect(value).toMatchSnapshot();
    expect(found).toBe(true);
    [value, found] = denormalize(
      fromJS({ item: null }),
      object,
      fromJS(entities),
    );
    expect(value).toMatchSnapshot();
    expect(found).toBe(true);
  });

  test('denormalizes plain object shorthand', () => {
    const userSchema = new schema.Entity('user');
    const entities = {
      user: {
        1: { id: 1, name: 'Jane' },
      },
    };
    expect(
      denormalize({ user: 1 }, { user: userSchema, tacos: {} }, entities),
    ).toMatchSnapshot();
    expect(
      denormalize(
        { user: 1 },
        { user: userSchema, tacos: {} },
        fromJS(entities),
      ),
    ).toMatchSnapshot();
    expect(
      denormalize(
        fromJS({ user: 1 }),
        { user: userSchema, tacos: {} },
        fromJS(entities),
      ),
    ).toMatchSnapshot();

    expect(
      denormalize(
        { user: 1, tacos: {} },
        { user: userSchema, tacos: {} },
        entities,
      ),
    ).toMatchSnapshot();
    expect(
      denormalize(
        { user: 1, tacos: {} },
        { user: userSchema, tacos: {} },
        fromJS(entities),
      ),
    ).toMatchSnapshot();
    expect(
      denormalize(
        fromJS({ user: 1, tacos: {} }),
        { user: userSchema, tacos: {} },
        fromJS(entities),
      ),
    ).toMatchSnapshot();
  });

  test('denormalizes an object that contains a property representing a an object with an id of zero', () => {
    const userSchema = new schema.Entity('user');
    const object = new schema.Object({
      user: userSchema,
    });
    const entities = {
      user: {
        0: { id: 0, name: 'Chancho' },
      },
    };
    expect(denormalize({ user: 0 }, object, entities)).toMatchSnapshot();
    expect(
      denormalize({ user: 0 }, object, fromJS(entities)),
    ).toMatchSnapshot();
    expect(
      denormalize(fromJS({ user: 0 }), object, fromJS(entities)),
    ).toMatchSnapshot();
  });
});