<%= renderer.include('block/hello.tpl') %>
<%= renderer.include('block/system-message.tpl', {text:_mail_reset_password}) %>
<%= renderer.include('block/link.tpl', {label: _mail_recreate_password}) %>
<%= renderer.include('block/signature.tpl') %>

