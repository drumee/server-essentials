<%= renderer.include('block/hello.tpl') %>
<%= renderer.include('block/system-message.tpl', {
  text: lex._signup_welcome_b2b
  })
%>
<%= renderer.include('block/link.tpl', {label: lex._mail_access_drumee}) %>
<%= renderer.include('block/signature.tpl') %>
