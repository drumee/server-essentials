<%= renderer.include('block/hello.tpl') %> 
<%= renderer.include('block/system-message.tpl', {
    text:message
  }) 
%>
<div style="
  margin-left: 30px;
  margin-right: 30px;
  margin-bottom: 40px;
  text-align: left;
  background-color: #f7f7f9;
  border-radius: 6px;
  padding: 10px 10px 0 10px;
  ">
  <div><%= renderer.include('block/field.tpl', {name: lex._domain_name, value:domain_name}) %></div>
  <div><%= renderer.include('block/field.tpl', {name: lex._licence_key, value:app_token}) %> </div>

</div>
<%= renderer.include('block/link.tpl', {label: lex._installation_manual, link: link}) %>
<%= renderer.include('block/signature.tpl') %>