<%= renderer.include('block/hello.tpl') %> 
<%= renderer.include('block/system-message.tpl', {
    text: lex._subscription_expired_message
  }) 
%>

<%= renderer.include('block/link.tpl', {link:redirect_link, label: lex._subscription_link}) %>
<%= renderer.include('block/signature.tpl') %>