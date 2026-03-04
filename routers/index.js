import express from "express";
import {paginaInicio} from "../controllers/inicioController.js";
import {paginaEncuentros, paginaDetallesEncuentros, guardarReserva} from "../controllers/encuentrosController.js";
import {paginaExperiencias, guardarExperiencias} from "../controllers/experienciasController.js";
import {paginaProductos, paginaDetallesProductos} from "../controllers/productosController.js";
import {quienesSomos} from "../controllers/somosController.js";
import {paginaLogin, paginaRegistro, autentificacion, guardarRegistros, cerrarSesion, confirmarCuenta, mostrarPerfil} from "../controllers/usuarioController.js";
import protegerRuta from '../middleware/protegerRuta.js';
import { agregarCarrito, carrito, borrarProductoCarrito, actualizarCantidad, finalizarCompra } from '../controllers/carritoController.js';
import {descargarFactura} from '../controllers/facturaController.js';
import admin from '../middleware/adminAuth.js';
import {panelPrincipal, crearProducto, crearEncuentro, eliminarProducto, eliminarEncuentro, editarEncuentro, editarProducto, vistaEditarEncuentro, vistaEditarProducto} from '../controllers/adminController.js';
import subirProducto from '../middleware/subirProducto.js';
import subirEncuentro from '../middleware/subirEncuentro.js';
import { realizarBusqueda } from '../controllers/buscadorController.js';
import {descargarReserva } from '../controllers/facturaEncuentroController.js';


const router = express.Router();
router.get("/", paginaInicio);
router.get("/encuentros", paginaEncuentros);
router.get("/experiencias", paginaExperiencias);
router.post("/experiencias", guardarExperiencias);
router.get("/productos", paginaProductos);
router.get("/nosotros", quienesSomos);
//los 2 puntos son un comodin para no repetir las paginas
router.get("/productos/:slug", paginaDetallesProductos);
router.get("/encuentros/:slug", paginaDetallesEncuentros);
router.get("/login" , paginaLogin);
router.get("/registro" , paginaRegistro);
router.post("/login" , autentificacion);
router.post("/registro" , guardarRegistros);
router.get("/logout" , cerrarSesion);
router.get("/factura", protegerRuta, descargarFactura);
router.get('/confirmar/:token', confirmarCuenta);
router.get('/perfil', protegerRuta, mostrarPerfil);
router.get('/administrador', protegerRuta, admin, panelPrincipal);
router.post('/productos', subirProducto.single('imagenProducto'), crearProducto);
router.post('/encuentros', subirEncuentro.single('imagenEncuentro'), crearEncuentro);
router.post('/administrador/borrarProducto/:id', protegerRuta, admin, eliminarProducto);
router.post('/administrador/borrarEncuentro/:id', protegerRuta, admin, eliminarEncuentro);
router.get('/administrador/editarEncuentro/:id', protegerRuta, admin, vistaEditarEncuentro);
router.post('/administrador/editarEncuentro/:id', protegerRuta, admin, subirEncuentro.single('imagenEncuentro'), editarEncuentro);
router.get('/administrador/editarProducto/:id', protegerRuta, admin, vistaEditarProducto);
router.post('/administrador/editarProducto/:id', protegerRuta, admin, subirProducto.single('imagenProducto'), editarProducto);
router.get('/buscador', realizarBusqueda);
router.get("/entrada/:id", protegerRuta, descargarReserva);
router.post('/encuentros/:id', protegerRuta, guardarReserva);


router.get("/carrito" , carrito);
router.post('/carrito/agregar/:id', protegerRuta, agregarCarrito);
router.get('/carrito/borrar/:id', protegerRuta, borrarProductoCarrito);
router.post('/carrito/actualizar/:id', protegerRuta, actualizarCantidad);
router.post('/carrito/finalizar', protegerRuta, finalizarCompra);
export default router;
