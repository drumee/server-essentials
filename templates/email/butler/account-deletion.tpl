<%= renderer.include('block/hello.tpl') %> 
<%= renderer.include('block/system-message.tpl', {
    text:_mail_delete_account_data.format(sender)
  }) 
%>

<% if(!_.isEmpty(message)) { %>
  <%= renderer.include('block/costum-message.tpl', {text:message }) %>
<% } %>

<%= renderer.include('block/system-message-2.tpl', {
    text:[_mail_delete_account_data, _confirm_with_authentication]
  }) 
%>
<%= renderer.include('block/link.tpl', {label: _mail_authenticate}) %>


<%= renderer.include('block/signature.tpl') %>
