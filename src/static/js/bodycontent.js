if (window.innerWidth > 1286) {
	if (document.getElementById("content") && document.getElementById("demo")) {
		document.getElementById("content").style.maxHeight = document.querySelector('body').offsetHeight - document.getElementById("demo").offsetHeight + "px";
	}
}