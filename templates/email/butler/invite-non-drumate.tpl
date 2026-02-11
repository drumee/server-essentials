<%= renderer.include('block/hello.tpl') %> 
<%= renderer.include('block/system-message.tpl', {
    text: lex._mail_non_drumee_network.format(sender)
  }) 
%>

<% if(!_.isEmpty(message)) { %>
  <%= renderer.include('block/costum-message.tpl', {text:message }) %>
<% } %>

<%= renderer.include('block/system-message.tpl', {
    text: lex._click_the_link_below_to_join_
  }) 
%>

<%= renderer.include('block/system-message.tpl', {
    text:sender
  }) 
%>