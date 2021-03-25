export const freeze =
  "freeze" in Object
    ? Object.freeze
    : (function freeze(obj: any) {
        return obj;
      } as ObjectConstructor["freeze"]);
