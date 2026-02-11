<%= renderer.include('block/hello.tpl') %>
<%= renderer.include('block/system-message.tpl', {
    text: lex._mail_change_password
  }) 
%>
<%= renderer.include('block/link.tpl', {label: lex._change_password}) %>
<%= renderer.include('block/signature.tpl') %>
