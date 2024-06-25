<%= renderer.include('block/hello.tpl') %>
<%= renderer.include('block/system-message.tpl', {
  text:_signup_welcome_b2b
  })
%>
<%= renderer.include('block/link.tpl', {label: _mail_access_drumee}) %>
<%= renderer.include('block/signature.tpl') %>
