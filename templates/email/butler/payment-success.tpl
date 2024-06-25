<%= renderer.include('block/hello.tpl') %> 
<%= renderer.include('block/system-message.tpl', {
    text:_renewal_succeed_message
  }) 
%>

<%= renderer.include('block/link.tpl', {link:redirect_link, label: _open_my_desktop}) %>
<%= renderer.include('block/signature.tpl') %>