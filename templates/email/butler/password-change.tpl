<%= renderer.include('block/hello.tpl') %>
<%= renderer.include('block/system-message.tpl', {
    text:_mail_change_password
  }) 
%>
<%= renderer.include('block/link.tpl', {label:_change_password}) %>
<%= renderer.include('block/signature.tpl') %>
