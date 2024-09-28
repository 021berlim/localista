# Localista

Localista é uma aplicação web que permite aos usuários buscar locais próximos a um endereço específico, filtrando por categorias como cafés, restaurantes, escolas, entre outros. A aplicação utiliza a API Nominatim para obter coordenadas geográficas e a Overpass API para recuperar informações sobre locais.

## Funcionamento

1. **Entrada de Dados**: O usuário insere um endereço em um campo de texto e seleciona uma categoria desejada (como Café, Restaurante, etc.).
  
2. **Busca de Coordenadas**: Ao clicar no botão "Buscar", a aplicação obtém as coordenadas geográficas do endereço inserido usando a API Nominatim.

3. **Busca de Locais**: Com as coordenadas, a aplicação realiza uma consulta à Overpass API para encontrar locais da categoria selecionada dentro de um raio de 2.000 metros.

4. **Exibição de Resultados**: Os locais encontrados são exibidos na página. Cada resultado contém o nome do local e um link que, ao ser clicado, mostra o endereço em um alerta.

## Como Iniciar

1. **Clone o repositório**:
   ```bash
   git clone <URL do repositório>
   cd localista´´´