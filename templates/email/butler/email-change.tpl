<%= renderer.include('block/hello.tpl') %>
<%= renderer.include('block/system-message.tpl', {
    text:_admin_mail_change_password
  }) 
%>
<%= renderer.include('block/link.tpl', {label:lex._admin_email_change_link}) %>
<%= renderer.include('block/signature.tpl') %>
