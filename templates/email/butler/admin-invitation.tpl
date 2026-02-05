<%= renderer.include('block/hello.tpl') %>
<%= renderer.include('block/system-message.tpl', {
    text:_admin_network_message.format(org_name)
  }) 
%>
<%= renderer.include('block/link.tpl', {label:_admin_network_link}) %>
<%= renderer.include('block/system-message.tpl', {
    text:sender
  }) 
%>
