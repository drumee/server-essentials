<%= renderer.include('block/hello.tpl') %>
<%= renderer.include('block/system-message.tpl', {
    text: lex._mail_sharebox.format(sender)
  }) 
%>

<% if(!_.isEmpty(message)) { %>
  <%= renderer.include('block/costum-message.tpl', {text:message }) %>
<% } %>

<%= renderer.include('block/link.tpl', {label: lex._mail_access_sharebox}) %>

<%= renderer.include('block/system-message.tpl', {
    text:sender
  }) 
%>


<%= renderer.include('block/note.tpl', {
    text: lex._note_sharebox
  }) 
%>