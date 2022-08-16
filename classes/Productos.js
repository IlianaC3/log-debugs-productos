class Contenedor {
	constructor(conection) {
		this.con = conection;
	}

	async save(product) {
		return this.con('productos')
			.insert(product)
			.then((id) => {
				return 'El producto se ha guardado  con ID: ' + id;
			})
			.catch((err) => {
				return 'No se pudo guardar el producto, intente más tarde.';
			});
	}

	async getById(id) {
		return this.con('productos')
			.select({
				id: 'id',
				title: 'title',
				price: 'price',
				thumbnail: 'thumbnail'
			})
			.where({ id })
			.then((productos) => {
				return productos[0];
			})
			.catch((err) => {
				console.error(err);
				return 'Error al encontrar productos';
			});
	}

	async getAll() {
		return this.con('productos')
			.select({
				id: 'id',
				title: 'title',
				price: 'price',
				thumbnail: 'thumbnail'
			})
			.then((productos) => {
				return productos;
			})
			.catch((err) => {
				console.error(err);
				return 'Error al encontrar productos';
			});
	}

	async updateById(id, product) {
		return this.con('productos')
			.update(product)
			.where({ id })
			.then((result) => {
				return result > 0 ? 'El producto se ha actualizado  con ID: ' + id : 'No se ha editado el producto';
			})
			.catch((err) => {
				return 'No se pudo guardar el producto, intente más tarde.';
			});
	}

	async deleteById(id) {
		return this.con('productos')
			.delete()
			.where({ id })
			.then((result) => {
				return result > 0 ? 'El producto se ha eliminado  con ID: ' + id : 'No se ha eliminado el producto';
			})
			.catch((err) => {
				return 'No se pudo guardar el producto, intente más tarde.';
			});
	}
}

module.exports = Contenedor;
