export default function mascaraCnpj() {
	const inputCnpj = document.getElementById('cnpj');

	input.addEventListener('input', function (e) {
		let value = e.target.value;
		value = value.replace(/\D/g, '');
		value = value.replace(/^(\d{2})(\d)/, '$1.$2');
		value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
		value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
		value = value.replace(/(\d{4})(\d)/, '$1-$2');
		e.target.value = value;
	}
	);
}