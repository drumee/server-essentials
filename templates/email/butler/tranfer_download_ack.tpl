<%= renderer.include('block/hello.tpl') %>
<%= renderer.include('block/system-message.tpl', {
    text:message 
  }) 
%>
<%= renderer.include('block/link.tpl', {label: _manage_transfer}) %>
<%= renderer.include('block/signature.tpl') %> 
