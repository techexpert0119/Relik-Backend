export interface AbstractControllerOptions<T, C, V> {
  model: { new (doc?: any): T };
  createDto: { new (doc?: any): C };
  updateDto: { new (doc?: any): V };
  name: string;
}

// export interface AbstractControllerWithAuthOptions<T>
//   extends AbstractControllerOptions<T> {
//   auth: DefaultAuthObject | boolean;
// }

// export interface AbstractControllerWithSwaggerOptions<T, VM, C>
//   extends AbstractControllerOptions<T> {
//   modelVm: { new (): VM };
//   modelCreate: { new (): C };
// }
