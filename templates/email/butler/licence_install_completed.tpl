<%= renderer.include('block/hello.tpl') %> 
<%= renderer.include('block/system-message.tpl', {
    text:message
  }) 
%> 
<%= renderer.include('block/link.tpl', {label: _change_password,link:reset_link}) %>

<%= renderer.include('block/link.tpl', {label: _read_install_manual,link:doc_link}) %>
<%= renderer.include('block/signature.tpl') %>