<%= renderer.include('block/hello.tpl') %>
<%= renderer.include('block/system-message.tpl', {text: lex._mail_reset_password}) %>
<%= renderer.include('block/link.tpl', {label: lex._mail_recreate_password}) %>
<%= renderer.include('block/signature.tpl') %>

