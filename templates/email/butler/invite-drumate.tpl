<%= renderer.include('block/hello.tpl') %> 
<%= renderer.include('block/system-message.tpl', {
    text:_network_drumate_message.format(sender)
  }) 
%>

<% if(!_.isEmpty(message)) { %>
  <%= renderer.include('block/costum-message.tpl', {text:message }) %>
<% } %>

<%= renderer.include('block/link.tpl', {link:redirect_link, label: _open_my_desktop}) %>

<%= renderer.include('block/system-message.tpl', {
    text:sender
  }) 
%>