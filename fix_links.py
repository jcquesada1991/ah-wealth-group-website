import sys

with open('AH_Wealth_Portal.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all internal anchor links to point to the index page instead
content = content.replace('href="#"', 'href="index.html"')
content = content.replace('href="#inicio"', 'href="index.html#inicio"')
content = content.replace('href="#servicios"', 'href="index.html#servicios"')
content = content.replace('href="#proceso"', 'href="index.html#proceso"')
content = content.replace('href="#clientes"', 'href="index.html#clientes"')
content = content.replace('href="#faq"', 'href="index.html#faq"')
content = content.replace('href="#contacto"', 'href="index.html#contacto"')

with open('AH_Wealth_Portal.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Links updated successfully")
