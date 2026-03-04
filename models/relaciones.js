import { usuarios as Usuario } from './usuarios.js';
import { pedidos as Pedido } from './pedidos.js';
import { reservas as Reserva } from './reservas.js';
import { encuentros as Encuentro } from './encuentros.js';
import { detalles_pedidos as DetallesPedido } from './detalles_pedidos.js';
import { productos as Producto } from './productos.js';


Usuario.hasMany(Pedido, { foreignKey: 'usuario_id' });
Pedido.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Usuario.hasMany(Reserva, { foreignKey: 'usuario_id' });
Reserva.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Encuentro.hasMany(Reserva, { foreignKey: 'encuentro_id' });
Reserva.belongsTo(Encuentro, { foreignKey: 'encuentro_id' });

Pedido.hasMany(DetallesPedido, { foreignKey: 'pedido_id', as: 'detalles' });
DetallesPedido.belongsTo(Pedido, { foreignKey: 'pedido_id' });

Producto.hasMany(DetallesPedido, { foreignKey: 'producto_id' });
DetallesPedido.belongsTo(Producto, { foreignKey: 'producto_id' });

export {
    Usuario,
    Pedido,
    Reserva,
    Encuentro,
    DetallesPedido,
    Producto
};