/**
 * CSInterface - Minimalist & Robust Bridge for Adobe CEP
 */
function CSInterface() {}

CSInterface.prototype.evalScript = function(script, callback) {
    if (window.__adobe_cep__) {
        window.__adobe_cep__.evalScript(script, callback || function() {});
    } else {
        console.warn("Adobe CEP environment not detected. Mocking evalScript:", script);
        if (callback) callback("MOCK_OK");
    }
};

CSInterface.prototype.closeExtension = function() {
    if (window.__adobe_cep__) {
        window.__adobe_cep__.closeExtension();
    }
};

window.CSInterface = CSInterface;
