import re
def probar_regex():
    # Ingresar la expresión regular
    patron = input("Ingresa la expresión regular: ")
    regex = re.compile(patron)
    print("\nEscribe las cadenas a probar (deja vacío y presiona Enter para terminar):")
    cadenas = []
    while True:
        cadena = input("> ")
        if cadena == "":
            break
        cadenas.append(cadena)
    print("\nResultados:")
    for c in cadenas:
        if regex.fullmatch(c):
            print(f"✔ '{c}' coincide con el patrón")
        else:
            print(f"✘ '{c}' NO coincide")
if __name__ == "__main__":
    probar_regex()
