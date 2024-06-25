<%= renderer.include('block/hello.tpl') %> 
<%= renderer.include('block/system-message.tpl', {
    text:_renewal_failed_message
  }) 
%>

<%= renderer.include('block/link.tpl', {link:redirect_link, label: _payment_link}) %>
<%= renderer.include('block/signature.tpl') %>