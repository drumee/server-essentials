<!DOCTYPE html>
<html lang="<%= lang %>">
  <%= renderer.include('block/head.tpl') %>
  <body style="background-color:#c8d1db; width:100%; height:100%;">
    <div style="
      margin: 0 ;
      padding: 50px 0px;
      width:100%;
      background-color:#c8d1db;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      font-family: Verdana, Sans serif;
      font-size:15px;
      ">
      <div style="
        display: block;
        width:450px;
        margin: 40px auto 0px auto;
        "> <!-- drumee-message-envelope outer --> 

        <%= renderer.include('block/logo.tpl') %>

        <% if(typeof(origin) !== 'undefined' && origin =='desk') { %>
        <div style="
          padding: 30px 0px 30px 30px;
          background-color:white;
        "> 
        <% }else{ %>
        <div style="
          padding: 30px;
          background-color:white;           
        "> 
        <% } %>
        <!-- drumee-message-envelope inner-->
        <%= page_content %>

        </div>
          <% if(typeof(origin) !== 'undefined' && origin =='desk') { %>
            <%= renderer.include('block/footer_next.tpl') %>
          <% }else{ %>
            <%= renderer.include('block/transfer_footer.tpl') %>
          <% } %>
      </div>
    </div>
  </body>
</html>
