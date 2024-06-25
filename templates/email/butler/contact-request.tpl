<style>
  .italic {
    opacity: 0.65;
    font-style: italic;
  }
</style>

<div class="drumee-message-me" style="font-family: Calibri;font-size: 16px;">
  <p><%= message %></p>
</div>

<div class="drumee-message-me" style="width:100%; height:1px; background:grey; padding-bottom:10px;"></div>

<div class="drumee-message-me-container">
  <div class="drumee-message-me" style="font-family: Calibri;font-size: 16px;">
    <p class="italic">Nom de l&prime;entreprise: <%= company_name %></p>
  </div>
  <div class="drumee-message-me" style="font-family: Calibri;font-size: 16px;">
    <p>Nom du contact: <%= contact_name %></p>
  </div>
  <div class="drumee-message-me" style="font-family: Calibri;font-size: 16px;">
    <p>E-mail: <%= email %></p>
  </div>
  <div class="drumee-message-me" style="font-family: Calibri;font-size: 16px;">
    <p>Téléphone: <%= phone %></p>
  </div>
</div>
